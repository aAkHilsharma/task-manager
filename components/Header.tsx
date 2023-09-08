"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

function Header() {
  return (
    <header className="mb-20">
      <div className="p-5 bg-gray-500/10 rounded-b-2xl">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-50" />
        <div className="flex items-center space-x-5 flex-1 justify-between w-full">
          <div className="text-2xl font-bold text-[#0055d1]">Trello</div>
          <div className="">
            <form className="flex items-center space-x-5 rounded-md p-2 shadow-md flex-1 md:flex-initial bg-white">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="flex-1 outline-none p-2"
              />
              <button type="submit" hidden>
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
