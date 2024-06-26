import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const filteredEvents = (
    (!type
      ? // Si aucun type n'est défini tous les évènements sont renvoyé
      data?.events
      :  // Si le type est défini, un filtre doit être ajouté pour afficher les événements en fonction de la sélection dans le composant Select
      data?.events.filter((event) => event.type === type)) || []
  ).filter((_, index) => {
    if (
      (currentPage - 1) * PER_PAGE <= index &&
      PER_PAGE * currentPage > index
    ) {
      return true;
    }
    return false;
  });
  const sortedEvents = filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date)); // Triage des évènements par ordre chronologique

  // console.log("Filtered events:", filteredEvents);
  const changeType = (evtType) => {
    // console.log("New type:", evtType);
    setCurrentPage(1);
    setType(evtType);
  };
  // Calcul du nombre total de pages en fonction du nombre d'événements après filtrage
  const totalFilteredEvents = data?.events.filter(event => !type || event.type === type);
  const pageNumber = Math.ceil((totalFilteredEvents?.length || 0) / PER_PAGE);
  const typeList = new Set(data?.events.map((event) => event.type));
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {sortedEvents.map((event) => ( // Pagination effectué par le trie chronologique
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}
              className={currentPage === n + 1 ? "activePage" : ""}>
                {n + 1}
              </a> // Ajout d'une class CSS activePage pour distinguer le numéro de page
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
