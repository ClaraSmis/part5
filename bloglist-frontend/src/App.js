import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    try{
      blogFormRef.current.toggleVisibility()
      const Blogcreate = await blogService.create(blogObject)
      setBlogs(blogs.concat(Blogcreate))
      //setMessage(`a new blog ${newTitle} by ${newAuthor} added`)
      /*setTimeout(() => {
        setMessage(null)
      }, 5000)*/
    }
    catch(exception)
    {
      setMessage(exception.message)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const updateLikes = async (id, blogToUpdate) => {
    try {
      const updatedBlog = await blogService.update(id, blogToUpdate)
      const newBlogs = blogs.map((blog) =>
        blog.id === id ? updatedBlog : blog
      )
      setBlogs(newBlogs)
    } catch (exception) {
      setMessage('error' + exception.message)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogin = async (event) => {
    try{
      event.preventDefault()
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      console.log(user.username)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch(exception){
      setMessage('Wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    try{
      window.localStorage.clear()
      setUser(null)
      setBlogs([])
    }
    catch(exception)
    {
      setMessage(exception.message)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (blogId) => {
    try {
      await blogService.remove(blogId)

      const newBlogs = blogs.filter((blog) => blog.id !== blogId)
      setBlogs(newBlogs)
      setMessage('Blog removed')
      setTimeout(() => {
        setMessage(null)
      }, 5000)

    } catch (exception) {
      setMessage('error' + exception.message)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const blogFormRef = useRef()

  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />

        </Togglable>
      </div>
    )
  }

  const blogForm = () => {
    return(
      <div>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog= {addBlog}/>
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} />
      {user === null ?
        (loginForm()):
        (
          <div>
            <p>{user.username} logged-in</p>
            <button onClick={handleLogout}>logout</button>
            {blogForm()}
            <h2>create new</h2>
            {blogs
              .sort((a,b) => (a.likes - b.likes))
              .map(blog =>
                <Blog key={blog.id} blog={blog} username = {user.username} update = {updateLikes} deleteBlog = {deleteBlog}/>
              )}
          </div>
        )
      }

    </div>
  )

}

export default App
