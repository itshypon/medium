import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@hypon/medium-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const header = c.req.header("Authorization") || "";
  try {
    const token = header.split(" ")[1];
    const response = await verify(token, c.env.JWT_SECRET);
    if (response.id) {
      c.set("userId", response.id.toString());
      await next();
    } else {
      c.status(403);
      return c.json({ error: "authorization" });
    }
  } catch (e) {
    console.log(e)
    return c.json({
      error: "You are not logged in",
    });
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Wrong input",
    });
  }
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: authorId,
    },
  });

  return c.json({
    id: blog.id,
  });
});

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Wrong input",
    });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = await prisma.blog.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json({
    id: blog.id,
  });
});

//add pagination

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        author: {
          select: {
            name: true
          }
        }
      }
    });

    return c.json({
      blog,
    });
  } catch (e) {
    return c.json({
      message: "error fetching all blogposts",
    });
  }
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true
          }
        }
      }
    });

    return c.json({
      blog,
    });
  } catch (e) {
    return c.json({
      message: "error fetching blogpost",
    });
  }
});
