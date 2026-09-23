import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-xs text-stone-500">
      <ol className="flex items-center flex-wrap gap-1.5">
        <li>
          <Link to="/" className="hover:text-[#8C5D38] transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <li>
                {isLast || !item.path ? (
                  <span className="text-[#1E1511] font-medium truncate max-w-[200px] sm:max-w-xs inline-block">
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.path} className="hover:text-[#8C5D38] transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
