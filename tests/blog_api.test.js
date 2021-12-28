const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {  
    await Blog.deleteMany({}) 
    let blogObject = new Blog(helper.initialBlogs[0]) 
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])  
    await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get("/api/blogs/")
    expect (response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)
    expect(contents).toContain('TEST: Kivikaupunki')
  })

test('add blog by POST method works', async () => {

    const blogToAdd =  {
        title: "Testaus on mukavaa",  
        author: "Leo Niemi",
        url: "null.blog",
        likes: 999
    }
    await api
    .post('/api/blogs')
    .send(blogToAdd)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain('Testaus on mukavaa')
})


test('New Blog with empty likes field gets 0 likes in database', async () => {
    const blogWithEmptyLikes = {
        title: "Kuinka saada ystäviä, menestystä ja vaikutusvaltaa",  
        author: "Dale Carnegie",
        url: "tama.on.kirja"
    }
    await api
    .post('/api/blogs')
    .send(blogWithEmptyLikes)
    .expect(200)
    .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    var newBlogObject = response.body.filter(x => x.author === 'Dale Carnegie')[0]
    expect(newBlogObject.likes).toBe(0)
})
test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[1]
    await api    
    .delete(`/api/blogs/${blogToDelete.id}`)    
    .expect(204)
})

afterAll(() => {
  mongoose.connection.close()
})