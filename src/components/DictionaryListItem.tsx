import React, { useCallback } from 'react';
import { useHistory } from 'react-router';

import { IonButton, IonItem, IonItemOptions, IonItemSliding, IonLabel, IonProgressBar } from '@ionic/react';

import { Dictionary } from '../models';
import { percent } from '../utils';

interface ListItemProps {
  item: Dictionary;
  segment?: string;
  onAddFavorite?: (value: Dictionary) => void;
  onRemoveFavorite?: (value: Dictionary) => void;
}

const DictionaryListItem: React.FC<ListItemProps> = ({ item, segment, onAddFavorite, onRemoveFavorite }) => {
  const history = useHistory();
  const handleClick = useCallback(() => {
    history.push('/learn', { id: item.id, title: item.name });
  }, [history, item]);
  const handleAddFavorite = useCallback(() => {
    if (onAddFavorite) {
      onAddFavorite(item);
    }
  }, [item, onAddFavorite]);
  const handleRemoveFavorite = useCallback(() => {
    if (onRemoveFavorite) {
      onRemoveFavorite(item);
    }
  }, [item, onRemoveFavorite]);

  return (
    <IonItemSliding>
      <IonItem button detail onClick={handleClick}>
        <IonLabel>{item.name}</IonLabel>
      </IonItem>
      <IonItemOptions>
        {segment === 'all' && (
          <IonButton color="favorite" onClick={handleAddFavorite}>
            Favorite
          </IonButton>
        )}
        {segment === 'favorites' && (
          <IonButton color="danger" onClick={handleRemoveFavorite}>
            Remove
          </IonButton>
        )}
      </IonItemOptions>
      <IonProgressBar color="primary" value={percent(item.wordsLearned, item.totalWords)} />
    </IonItemSliding>
  );
};

export default DictionaryListItem;