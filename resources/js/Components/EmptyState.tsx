import { Link } from '@inertiajs/react';
import React from 'react';

interface EmptyStateProps {
  errorCode?: string;
  title: string;
  message: string;
  link?: { href: string; label: string; external?: boolean };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  errorCode,
  title,
  message,
  link = undefined,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center min-h-64">
      {errorCode && (
        <h1 className="mb-0 text-3xl text-gray-400 fw-bold">
          {errorCode}
        </h1>
      )}
      <h2 className="mb-3 text-xl font-semibold text-gray-700 h4">
        {title}
      </h2>
      <p className="max-w-md text-gray-500">
        {message}
      </p>
      {link && (
        link.external ? (
          <a
            className="btn btn-primary"
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ) : (
          <Link
            className="btn btn-primary"
            href={link.href}
          >
            {link.label}
          </Link>
        )
      )}
    </div>
  );
};

export default EmptyState;
