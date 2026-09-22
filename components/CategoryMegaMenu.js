"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categoryTree } from "@/data/categories";

export default function CategoryMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeParent, setActiveParent] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveParent(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function closeAll() {
    setIsOpen(false);
    setActiveParent(null);
  }

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={closeAll}
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex shrink-0 items-center gap-1 px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark"
      >
        Catégories
        <span aria-hidden="true">▾</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 z-20 mt-0 w-64 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {categoryTree.map((category) => (
            <div
              key={category.name}
              className="relative"
              onMouseEnter={() => setActiveParent(category.name)}
            >
              <Link
                href={`/?category=${encodeURIComponent(category.name)}`}
                onClick={closeAll}
                className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-brand-light hover:text-brand"
              >
                {category.name}
                {category.subs.length > 0 && (
                  <span aria-hidden="true" className="text-gray-400">
                    ▸
                  </span>
                )}
              </Link>

              {activeParent === category.name && category.subs.length > 0 && (
                <div className="absolute left-full top-0 z-30 w-56 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                  {category.subs.map((sub) => (
                    <Link
                      key={sub}
                      href={`/?category=${encodeURIComponent(sub)}`}
                      onClick={closeAll}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-light hover:text-brand"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
