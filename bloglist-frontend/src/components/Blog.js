import { useState } from 'react'
const Blog = ({ blog, username, deleteBlog, update }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const blogToUpdate = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    update(blog.id, blogToUpdate)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  return(
    <div id = "blogs">
      <div>
        <span className='title'>{blog.title} </span>
        <span className='author'>{blog.author} </span>
      </div>
      <button id="view" onClick={toggleVisibility}>
        {visible ? 'hide' : 'show'}
      </button>
      {visible && (
        <div className="details">
          <div> <span className='url'>{blog.url}</span></div>
          <div className = 'likes'>
            Likes: {blog.likes}
            <button id="like" onClick={handleLike}>
              like
            </button>{' '}
          </div>
          <div>{blog.user.username}</div>
          {blog.user.username === username && (
            <button id="delete" onClick={handleDelete}>
              delete
            </button>
          )}
        </div>
      )}

    </div>
  )
}
export default Blog