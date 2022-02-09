import React, { useEffect, useState } from "react";

import ReactDOMServer from "react-dom/server";

import L from "leaflet";
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from "react-leaflet";

import { BiBuildingHouse } from "react-icons/bi";

import "./style.css";
import Sidebar from "../../components/Sidebar";

const Home = () => {
  const [geoJSON, setGeoJSON] = useState(
    JSON.parse(localStorage.getItem("geoJSON")) || undefined
  );

  const [isLoading, setIsLoading] = useState(false);

  const [searchKey, setSearchKey] = useState(
    localStorage.getItem("searchKey") || "amenity"
  );
  const [searchValue, setSearchValue] = useState(
    localStorage.getItem("searchValue") || "school"
  );
  const [searchLimit, setSearchLimit] = useState(
    localStorage.getItem("searchLimit") || 2000
  );
  const [searchOperator, setSearchOperator] = useState(
    localStorage.getItem("searchOperator") || "is-equal-to"
  );

  useEffect(() => {
    if (!geoJSON) {
      fetch(`http://localhost:4444/school.geojson`)
        .then((resp) => resp.json())
        .then((resp) => {
          setGeoJSON(resp);

          getFeatures(resp.features).then((r) => {
            setFilteredFeatures(r);
            setIsLoading(false);
          });
          localStorage.setItem("geoJSON", JSON.stringify(resp));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const renderTitle = (t) => {
    switch (t) {
      case "amenity":
        return (
          <div style={{ position: "absolute", top: 5, left: 10 }}>
            <BiBuildingHouse size={40} />
          </div>
        );
      case "name:en":
        return "name";
      case "addr:city":
        return "city";

      case "addr:country":
        return "country";

      case "addr:postcode":
        return "postcode";

      case "addr:state":
        return "state";

      case "addr:street":
        return "street";

      case "contact:email":
        return "email";
      case "personnel:count":
        return "personnel";
      case "student:count":
        return "student";
      default:
        return t;
    }
  };

  const renderValue = (t, school) => {
    switch (t) {
      case "amenity":
        return "";
      default:
        return school.properties[t];
    }
  };

  const renderPopUp = (school) => {
    return (
      <>
        {Object.keys(school.properties).map((k, i) => {
          if (i == 0) return "";
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  textTransform: "lowercase",
                  fontWeight: 800,
                  width: 100,
                }}
              >
                {renderTitle(k)}
              </span>{" "}
              <p style={{ margin: 0 }}>{renderValue(k, school)}</p>
            </div>
          );
        })}
      </>
    );
  };

  const onEachSchool = (school, layer) => {
    const icon = L.icon({
      iconUrl: `http://localhost:4444/toppng.com-school-png-830x1170.png`,
      iconSize: [830 / 20, 1190 / 20],
    });
    layer.options.icon = icon;
    layer.bindPopup(
      ReactDOMServer.renderToStaticMarkup(
        <div style={{ marginTop: 50 }}>{renderPopUp(school)}</div>
      )
    );
  };

  const getFeatures = async (features) => {
    let sl = localStorage.getItem("searchLimit");
    let sk = localStorage.getItem("searchKey");
    let sv = localStorage.getItem("searchValue");

    const filter = (f) => {
      let closestMatchingProperties = [];

      let squashedProperties = Object.keys(f.properties).map((p) => {
        if (p.includes(sk.toLowerCase())) {
          closestMatchingProperties.push(p);
        }
        return p;
      });

      let handler =
        squashedProperties.includes(sk.length ? sk.toLowerCase() : "amenity") &&
        Object.keys(f.properties)
          .filter((pp) => closestMatchingProperties.includes(pp))
          .map((k) => f.properties[k])
          .join("")
          .toLowerCase()
          .includes(sv.toLowerCase());
      return handler;
    };

    return Promise.all(features.filter(filter).slice(0, sl));
  };

  const [key, setKey] = useState();

  const [filteredFeatures, setFilteredFeatures] = useState();

  const renderFeature = () => {
    let tempGeoJson = JSON.parse(localStorage.getItem("geoJSON"));
    if (tempGeoJson) {
      getFeatures(tempGeoJson.features).then((resp) => {
        setFilteredFeatures(resp);
        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    setKey(Math.random());
  }, [filteredFeatures]);

  useEffect(() => {
    setIsLoading(true);

    localStorage.setItem("searchKey", searchKey);
    localStorage.setItem("searchOperator", searchOperator);
    localStorage.setItem("searchValue", searchValue);
    localStorage.setItem("searchLimit", searchLimit);

    renderFeature();
  }, [searchKey, searchOperator, searchValue, searchLimit, geoJSON]);

  return (
    <>
      <Sidebar
        totalItems={filteredFeatures?.length}
        onParamsChange={(sk, sv, sl) => {
          setSearchKey(sk);
          setSearchLimit(sl);
          setSearchValue(sv);
        }}
      />
      {isLoading ? (
        <div
          className="loading-screen"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            zIndex: 444,
            background: "#ffffff1e",
            backdropFilter: "blur(9px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            class="spinner-border"
            style={{ width: "1rem", height: "1rem" }}
            role="status"
          >
            <span class="sr-only"></span>
          </div>
          Updating Data..
        </div>
      ) : (
        ""
      )}
      {geoJSON && filteredFeatures ? (
        <MapContainer
          center={[27.700769, 85.30014]}
          zoom={localStorage.getItem("zoom") || 15}
          key={key}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents />
          <GeoJSON data={filteredFeatures} onEachFeature={onEachSchool} />
        </MapContainer>
      ) : (
        ""
      )}
    </>
  );
};

const MapEvents = () => {
  let mapEvents = useMapEvents({
    zoomend: () => {
      localStorage.setItem("zoom", mapEvents.getZoom());
    },
  });
  return null;
};
export default Home;
