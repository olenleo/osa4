const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get(':id',(request, response, next) => {
    Blog.findById(request.params.id)
    .then(blog => {
   
        if (blog) {
            response.json(blog.toJSON())
        } else {
 
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})



blogsRouter.get('/', async (request, response, next) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
})


blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    // const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI
    let likevar
    if(body.hasOwnProperty('likes')){
        likevar = body.likes
    } else {
        likevar = 0
    }
    
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: likevar
    })  
    const savedBlog = await blog.save()
    response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', (request, response, next) => {
    Blog.findByIdAndRemove(request.params.id)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

  
  blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body
  
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
  
    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      .then(updatedBlog => {
        response.json(updatedBlog.toJSON())
      })
      .catch(error => next(error))
  })
  
  module.exports = blogsRouter