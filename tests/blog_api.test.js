const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')


beforeEach(async () => {
    await Blog.deleteMany({})
  
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test("blogs' unique identifier is id", async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined();
})

test('there are six blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})
  
test('the first blog is about React patterns', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title);
  
    expect(titles).toContain('React patterns')
})

test('a valid blog can be added', async () => {
    const newBlog = {
      title: "async/await simplifies making async calls",
      author: "async await",
      url: "https://asyncwaitpatterns.com/",
      likes: 7,
      _id: 'uniqueId123'
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(
      'async/await simplifies making async calls'
    )
})

test('blog without title is not added', async () => {
    const newBlog = {
      author: "No title",
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    
})

test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
    const blogToView = blogsAtStart[0]
  
  
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    expect(resultBlog.body).toEqual(blogToView)
})
  
test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(200)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )
  
    const titles = blogsAtEnd.map(r => r.title)
  
    expect(titles).not.toContain(blogToDelete.title)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToReplace = blogsAtStart[0];
  const newBlog = {
    title: blogToReplace.title,
    author: blogToReplace.author,
    url: blogToReplace.url,
    likes: blogToReplace.likes + 1
  }

  await api
    .put(`/api/blogs/${blogToReplace.id}`)
    .send(newBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length
  )
  expect(blogsAtEnd[0].likes).toEqual(newBlog.likes)
})

afterAll(async () => {
  await mongoose.connection.close()
})