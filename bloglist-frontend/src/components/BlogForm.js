import { useState } from 'react'
const BlogForm = ({ createBlog }) => {
  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const addBlog = async (event) => {

    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url : newUrl,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <label>title:
        <input
          value={newTitle}
          onChange={handleTitleChange}
          placeholder='title'
        />
      </label>
      <br></br>
      <label>author:
        <input
          value={newAuthor}
          onChange={handleAuthorChange}
          placeholder='author'
        />
      </label>
      <br></br>
      <label>url:
        <input
          value={newUrl}
          onChange={handleUrlChange}
          placeholder='url'
        />
      </label>

      <button type="submit">save</button>
    </form>
  )

}

export default BlogForm