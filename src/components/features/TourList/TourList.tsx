import React from 'react';
import { TourCard } from '../TourCard/TourCard';
import type { TourItem } from '../../../models/tour';
import styles from './TourList.module.css';

interface TourListProps {
  tours: TourItem[];
}

export const TourList: React.FC<TourListProps> = ({ tours }) => (
  <ul className={styles.grid}>
    {tours.map((tour) => (
      <li key={tour.id} className={styles.cell}>
        <TourCard tour={tour} />
      </li>
    ))}
  </ul>
);
