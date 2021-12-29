const Blog = require('../models/blog')
const User = require('../models/user')
const initialBlogs = [ 
    {
        title: "TEST: Kivikaupunki",  
        author: "Tapio Niemi",
        url: "tappari.blog",
        likes: 1
    },  
    {    
        title: "TEST: Underbara Clara",  
        author: "Clara",
        url: "https://underbaraclaras.se/",
        likes: 55
    }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: "Niles" })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }
  
const blogToDelete = 
    {
        title: "BlogToDelete",  
        author: "Anon",
        url: "blog",
        likes: 1
    }


module.exports = {
  initialBlogs, nonExistingId, blogsInDb, blogToDelete, usersInDb
}