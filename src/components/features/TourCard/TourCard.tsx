import React from 'react';
import type { TourItem } from '../../../models/tour';
import styles from './TourCard.module.css';

interface TourCardProps {
  tour: TourItem;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function calcNights(startDate: string, endDate: string): number {
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const nights = calcNights(tour.startDate, tour.endDate);

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={tour.hotel.img} alt={tour.hotel.name} className={styles.image} />
      </div>
      <div className={styles.body}>
        <h3 className={styles.hotelName}>{tour.hotel.name}</h3>
        <p className={styles.location}>
          {tour.hotel.cityName}, {tour.hotel.countryName}
        </p>
        <div className={styles.dates}>
          <span>{formatDate(tour.startDate)}</span>
          <span className={styles.separator}>→</span>
          <span>{formatDate(tour.endDate)}</span>
          <span className={styles.nights}>{nights} ночей</span>
        </div>
        <div className={styles.footer}>
          <span className={styles.price}>
            {tour.amount.toLocaleString('uk-UA')} {tour.currency.toUpperCase()}
          </span>
        </div>
      </div>
    </article>
  );
};
