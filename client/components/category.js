import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Category = (props) => {
  const [newCategory, setNewCategory] = useState('')

  return (
    <div className="flex items-center justify-center h-screen text-center ">
      <div className="bg-gray-300 p-2 rounded">
        {props.categoryList.map((el) => (
          <div>
            <span className="hover:text-red-500">
              <Link to={`/${el}`}>{el}</Link>
            </span>
          </div>
        ))}
        <input
          className="p-1 rounded"
          placeholder="Add category"
          type="text"
          onChange={(e) => setNewCategory(e.target.value)}
          value={newCategory}
        />
        <button
          className="bg-gray-500 p-1 rounded"
          type="button"
          onClick={() => props.addCategory(newCategory)}
        >
          Add
        </button>
      </div>
    </div>
  )
}
Category.propTypes = {}

export default React.memo(Category)
