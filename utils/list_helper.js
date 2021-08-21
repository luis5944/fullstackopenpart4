const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }
  return blogs.reduce((acc, current) => {
    return acc + current.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  let max = blogs[0].likes;
  let maxBlog = {
    title: blogs[0].title,
    author: blogs[0].author,
    likes: blogs[0].likes,
  };

  blogs.forEach((b) => {
    if (b.likes > max) {
      maxBlog = { title: b.title, author: b.author, likes: b.likes };
      max = maxBlog.likes;
    }
  });

  return maxBlog;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  let array = [];

  blogs.forEach((b) => {
    const exist = array.find((bb) => b.author === bb.author);
    if (exist) {
      array = array.map((blog) =>
        blog.author === exist.author ? { ...blog, blogs: blog.blogs + 1 } : blog
      );
    } else {
      array = [...array, { author: b.author, blogs: 1 }];
    }
  });

  let maxBlogs = array[0];
  let max = array[0].blogs;
  array.forEach((b) => {
    if (b.blogs > max) {
      maxBlogs = b;
      max = b.blogs;
    }
  });

  return maxBlogs;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  let array = [];

  blogs.forEach((b) => {
    const exist = array.find((bb) => b.author === bb.author);
    if (exist) {
      array = array.map((blog) =>
        blog.author === exist.author
          ? { ...blog, likes: blog.likes + b.likes }
          : blog
      );
    } else {
      array = [...array, { author: b.author, likes: b.likes }];
    }
  });

  let maxLikes = array[0];
  let max = array[0].likes;
  array.forEach((b) => {
    if (b.likes > max) {
      maxLikes = b;
      max = b.likes;
    }
  });

  return maxLikes;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
