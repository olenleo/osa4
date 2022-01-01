const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { decode } = require('punycode')

const getTokenFrom =  request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

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
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid!' })
    }
    const user = await User.findById(decodedToken.id)
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
        likes: likevar,
        user: user._id
    })  
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response, next) => {
    var mongoose = require('mongoose');
    var id = mongoose.Types.ObjectId(request.params.id);
    const blog = await Blog.findById(id)
    await Blog.findByIdAndRemove(id)
    return response.status(204).end()
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