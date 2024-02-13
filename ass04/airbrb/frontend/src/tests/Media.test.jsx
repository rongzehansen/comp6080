import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Media from '../components/Listing/Media';

describe('Media Component', () => {
  const mockListingObject = {
    thumbnail: [
      'https://example.com/image1.jpg',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://example.com/image2.jpg'
    ]
  };

  it('renders without crashing', () => {
    render(<Media listingObject={mockListingObject} />);
  });

  it('displays the first media item initially', () => {
    render(<Media listingObject={mockListingObject} />);
    const imageElement = screen.getByRole('img');
    expect(imageElement).toHaveAttribute('src', mockListingObject.thumbnail[0]);
  });

  it('navigates to the next media item when next button is clicked', () => {
    const { container } = render(<Media listingObject={mockListingObject} />);
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);

    // Check if YouTube iframe is rendered as the next media
    const iframeElement = container.querySelector('iframe');
    expect(iframeElement).toBeInTheDocument();
  });

  it('navigates to the previous media item when back button is clicked', () => {
    render(<Media listingObject={mockListingObject} />);
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton); // Move to the second media item

    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);

    // Check if it navigates back to the first media item
    const imageElement = screen.getByRole('img');
    expect(imageElement).toHaveAttribute('src', mockListingObject.thumbnail[0]);
  });
});
