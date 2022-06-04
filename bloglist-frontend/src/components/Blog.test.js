import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'


test('a blog renders the blog title and author, but does not render its url or number of likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: "X", 
    url: "x.com",
    likes: 0,
    user: {
      username: "Clara",
    },
  }

  const { container } = render(<Blog blog={blog}/>)

  const url = screen.queryByText('url')
  const likes = screen.queryByText('likes')

  expect(url).toBeNull()
  expect(likes).toBeNull()

  expect(container.querySelector(".title")).toHaveTextContent(
    blog.title
  );
  expect(container.querySelector(".author")).toHaveTextContent(
    blog.author
  );
})

test('clicking the button calls event handler once', async () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: "X", 
        url: "x.com",
        likes: 0,
        user: {
          username: "Clara",
        },
      }
  
    const { container } = render(<Blog blog={blog}/>)
  
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    expect(container.querySelector(".details")).toBeDefined()
  
  })

  test('clicking the button like twice calls event handler twice', async () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: "X", 
        url: "x.com",
        likes: 0,
        user: {
          username: "Clara",
        },
      }
  
    const mockHandlerLikes = jest.fn()
  
    const { container } = render(<Blog blog={blog} update={mockHandlerLikes}/>)
  
    const user = userEvent.setup()
    const show = screen.getByText('show')
    await user.click(show)
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)
  
    expect(mockHandlerLikes.mock.calls).toHaveLength(2)
  })

  test('<BlogForm /> updates parent state and calls onSubmit', async () => {

    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: "X", 
        url: "x.com",
        likes: 0,
        user: {
          username: "Clara",
        },
      }

    const createBlog = jest.fn()
    const user = userEvent.setup()
  
    render(<BlogForm createBlog={createBlog} />)
  
    const title = screen.getByPlaceholderText('title')
    const author = screen.getByPlaceholderText('author')
    const url = screen.getByPlaceholderText('url')

    const sendButton = screen.getByText('save')
  
    await user.type(title, 'testing a form...' )
    await user.type(author, 'author')
    await user.type(url, 'url.com')
    await user.click(sendButton)
  
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing a form...' )
    expect(createBlog.mock.calls[1][0].author).toBe('author')
    expect(createBlog.mock.calls[2][0].url).toBe('url')
  })