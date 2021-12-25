
const dummy = (blogs) => {
    // ...
    return 1
  }
  
const totalLikes = ( blogs ) => {
    let likes = 0
    blogs.forEach(blog => {
        likes += blog.likes
    });
    return likes
}

const favouriteBlog = ( blogs ) => {
    let bestBlog
    let max = 0
    blogs.forEach(blog => {
        if (blog.likes > max) {
            bestBlog = blog
             max = bestBlog.likes
            }
    })
    toReturn = {
        title: bestBlog.title,
        author: bestBlog.author,
        likes: bestBlog.likes
    }
    return toReturn
}
  module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
  }