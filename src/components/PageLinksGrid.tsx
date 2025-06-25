
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

interface PageLinksGridProps {
  pageLinks: any[];
}

const PageLinksGrid: React.FC<PageLinksGridProps> = ({ pageLinks }) => {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mx-auto mt-8">
      {pageLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className="text-center bg-gray-50 p-2 animate-fade-in transition-all duration-300 block rounded-lg hover:shadow-xl active:bg-opacity-100"
          style={{
            backgroundColor: '#DBEAFE'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F7F9F9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#DBEAFE';
          }}
          onClick={(e) => {
            e.currentTarget.style.backgroundColor = '#F7F9F9';
          }}
        >
          <h3 className="font-semibold mb-1 text-base" style={{ color: '#B3B6B7' }}>
            {link.title[language]}
          </h3>
          <p className="text-gray-600 text-xs leading-snug">{link.description[language]}</p>
        </Link>
      ))}
    </div>
  );
};

export default PageLinksGrid;
