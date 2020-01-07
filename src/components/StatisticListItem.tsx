import differenceInDays from 'date-fns/differenceInDays';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import startOfDay from 'date-fns/startOfDay';
import startOfToday from 'date-fns/startOfToday';
import React from 'react';

import { IonBadge, IonCol, IonGrid, IonItem, IonLabel, IonRow } from '@ionic/react';

import { Statistic } from '../models';

interface StatisticListItemProps {
  item: Statistic;
  showCount?: boolean;
}

const StatisticListItem: React.FC<StatisticListItemProps> = ({ item, showCount }) => {
  function nextOccurString(nextOccur: string | undefined) {
    if (!nextOccur) {
      return undefined;
    }
    const date = parseISO(nextOccur);
    const days = differenceInDays(startOfDay(date), startOfToday());
    // eslint-disable-next-line no-console
    console.log({ date, days });
    if (days <= 0) {
      return 'today';
    }
    if (days === 1) {
      return 'tomorrow';
    }
    return format(date, 'PPPP');
  }

  return (
    <IonItem>
      <IonLabel>
        <IonGrid class="ion-no-margin ion-no-padding">
          <IonRow>
            <IonCol>
              <div>
                <strong>{item.text}</strong>
              </div>
              <small>{item.transcription}</small>
            </IonCol>
            <IonCol>{item.translation}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <p style={{ fontSize: '60%', whiteSpace: 'normal' }}>{`${item.partOfSpeech} : ${item.category}`}</p>
            </IonCol>
          </IonRow>
          {item.nextOccur && (
            <IonRow>
              <IonCol>
                <p style={{ fontSize: '60%', whiteSpace: 'normal' }}>{`Next occur: ${nextOccurString(item.nextOccur)}`}</p>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonLabel>
      {showCount && (
        <IonBadge slot="end" color="primary">
          {item.count}
        </IonBadge>
      )}
    </IonItem>
  );
};

export default StatisticListItem;
