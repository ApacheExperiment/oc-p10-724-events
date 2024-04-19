import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
  new Date(evtA.date) - new Date(evtB.date) // Odre de tri  inversé puis simplifié
);
const nextCard = () => {
  // Ajout d'une vérification pour éviter les erreurs si byDateDesc est null ou undefined
  setIndex(index < (byDateDesc && byDateDesc.length - 1) ? index + 1 : 0);
};
useEffect(() => {
  const timeoutSlider = setTimeout(() => { // Utilisation de clearTimeout pour nettoyer le timeout à chaque mise à jour
    nextCard();
  }, 5000);
  return () => clearTimeout(timeoutSlider);
}, [nextCard]); // Ajout de nextCard comme dépendance de useEffect
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        // Utilisation de Math.random() comme clé temporaire
        // Suite au message d'erreur suivant:
        // Warning: Each child in a list should have a unique "key" prop.
        // Check the render method of `Slider`. See https://reactjs.org/link/warning-keys for more information.
        <div key={Math.random()}>  
          <div
            key={event.title} 
            className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((_, radioIdx) => (
               // Utilisation de Math.random() comme clé temporaire
               // event.id n'était pas défini il faut donc lui donner une clé d'index unique à l'input
                <input
                  key={`${Math.random()}`}
                  type="radio"
                  name="radio-button"
                  checked={index === radioIdx} // Utilisation du bon index pour mettre à jour la pagination des bullet point
                  onChange={() => setIndex(radioIdx)} // console error : Warning: You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;
