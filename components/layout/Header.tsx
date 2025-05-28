"use client"

import { MagnifyingGlassIcon, BellIcon, EnvelopeIcon, Bars3Icon } from "@heroicons/react/24/outline"

interface HeaderProps {
  title?: string
  searchPlaceholder?: string
}

export default function Header({ title, searchPlaceholder = "Rechercher..." }: HeaderProps) {
  return (
    <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      <div className="flex items-center md:hidden">
        <button className="text-gray-500 focus:outline-none">
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder={searchPlaceholder}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="text-gray-500 focus:outline-none">
            <BellIcon className="h-6 w-6" />
          </button>
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </div>
        <div className="relative">
          <button className="text-gray-500 focus:outline-none">
            <EnvelopeIcon className="h-6 w-6" />
          </button>
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </div>
        <div className="flex items-center">
          <img
            className="h-8 w-8 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Avatar"
          />
        </div>
      </div>
    </div>
  )
}
