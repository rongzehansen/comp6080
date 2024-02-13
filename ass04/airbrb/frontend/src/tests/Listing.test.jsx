import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Listing from '../components/Listing/Listing.jsx';
// import * as request from '../utils/request.jsx';
import AuthContext from '../context/AuthContext.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the request module
jest.mock('../utils/request.jsx');

describe('Listing Component', () => {
  const mockListingObject = {
    id: 1,
    owner: 'alina@unsw.edu.au',
    title: 'Test Listing',
    address: {
      territory: 'Test Territory',
      suburb: 'Test Suburb',
      detailAddress: 'Test Address',
      postcode: '12345'
    },
    price: 350,
    thumbnail: [
      'https://example.com/image1.jpg',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://example.com/image2.jpg'
    ],
    metadata: {},
    reviews: [],
    availability: [],
    published: true,
    postedOn: '2020-10-31T14:45:21.077Z'
  };

  it('renders without crashing', () => {
    render(
      <Router>
        <AuthContext.Provider value={{ user: { userId: 'testUser' } }}>
          <Listing listingObject={mockListingObject} />
        </AuthContext.Provider>
      </Router>
    );
  });

  it('displays listing information', () => {
    render(
      <Router>
        <AuthContext.Provider value={{ user: { userId: 'testUser' } }}>
          <Listing listingObject={mockListingObject} />
        </AuthContext.Provider>
      </Router>
    );

    expect(screen.getByText(mockListingObject.title)).toBeInTheDocument();
    expect(screen.getByText(`${mockListingObject.address.territory}, ${mockListingObject.address.suburb}, ${mockListingObject.address.detailAddress}, ${mockListingObject.address.postcode}`)).toBeInTheDocument();
  });
});
