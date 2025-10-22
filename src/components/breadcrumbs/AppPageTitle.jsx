import React from 'react'

function AppPageTitle({ title, description }) {
  return (
     <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
  )
}

export default AppPageTitle