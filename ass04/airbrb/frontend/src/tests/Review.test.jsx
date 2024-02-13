import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Reviews from '../components/Room/Reviews.jsx';
import AuthContext from '../context/AuthContext.jsx';
import * as request from '../utils/request.jsx';

// Mock the request module
jest.mock('../utils/request.jsx', () => ({
  getAllBookings: jest.fn(),
  leaveAReview: jest.fn(),
  getListingDetails: jest.fn(),
}));

describe('Reviews Component', () => {
  const mockListingObject = {
    id: 1,
    title: 'Test Listing',
    owner: 'ownerId',
    reviews: [
      { id: 1, userId: 'user1', comment: 'Nice place1', rating: 4, postedOn: '2021-01-01T00:00:00.000Z' },
      { id: 2, userId: 'user2', comment: 'Nice place2', rating: 5, postedOn: '2021-01-01T00:00:00.000Z' },
      { id: 3, userId: 'user3', comment: 'Nice place3', rating: 3, postedOn: '2021-01-01T00:00:00.000Z' },
      { id: 4, userId: 'user4', comment: 'Nice place4', rating: 2.4, postedOn: '2021-01-01T00:00:00.000Z' },
      { id: 5, userId: 'user5', comment: 'Nice place5', rating: 2.2, postedOn: '2021-01-01T00:00:00.000Z' },
      { id: 6, userId: 'user6', comment: 'Nice place6', rating: 3, postedOn: '2021-01-01T00:00:00.000Z' },
      { id: 7, userId: 'user7', comment: 'Nice place7', rating: 3.7, postedOn: '2021-01-01T00:00:00.000Z' },
      { id: 8, userId: 'user8', comment: 'Nice place8', rating: 5, postedOn: '2021-01-01T00:00:00.000Z' },
    ]
  };

  const mockUser = { userId: 'user1' };

  beforeEach(() => {
    request.getAllBookings.mockResolvedValue([]);
    request.getListingDetails.mockResolvedValue(mockListingObject);
    request.leaveAReview.mockResolvedValue({});
  });

  it('renders without crashing', () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <Reviews listingObject={mockListingObject} />
      </AuthContext.Provider>
    );
  });

  it('displays reviews', async () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <Reviews listingObject={mockListingObject} />
      </AuthContext.Provider>
    );

    let reviewComment = await screen.findByText('Nice place1');
    expect(reviewComment).toBeInTheDocument();
    reviewComment = await screen.findByText('Nice place2');
    expect(reviewComment).toBeInTheDocument();
    reviewComment = await screen.findByText('Nice place3');
    expect(reviewComment).toBeInTheDocument();
    reviewComment = await screen.findByText('Nice place4');
    expect(reviewComment).toBeInTheDocument();
    reviewComment = await screen.findByText('Nice place5');
    expect(reviewComment).toBeInTheDocument();
    reviewComment = await screen.findByText('Nice place6');
    expect(reviewComment).toBeInTheDocument();
    reviewComment = await screen.findByText('Nice place7');
    expect(reviewComment).toBeInTheDocument();
    reviewComment = await screen.findByText('Nice place8');
    expect(reviewComment).toBeInTheDocument();
  });
});
