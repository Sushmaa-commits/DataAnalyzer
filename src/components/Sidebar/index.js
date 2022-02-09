import React, { useEffect, useState } from "react";

function Sidebar({ onParamsChange, totalItems }) {
  const [searchKey, setSearchKey] = useState("amenity");
  const [searchValue, setSearchValue] = useState("school");
  const [searchLimit, setSearchLimit] = useState(200);
  const [autoUpdate, setAutoUpdate] = useState(false);

  useEffect(() => {
    if (autoUpdate) {
      onParamsChange && onParamsChange(searchKey, searchValue, searchLimit);
    }
  }, [searchKey, searchLimit, searchValue]);

  return (
    <div
      className="sidebar"
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        background: "#e3e3eb",
        zIndex: 444,
      }}
    >
      <div className="mt-3 m-5">
        <h3>Data Analyzer</h3>
        <div>
          Total Items: <h6>{totalItems}</h6>
        </div>
        <hr></hr>
        <div className="form-group mb-3">
          <label className="form-label" for="auto-update">
            Auto Update?
          </label>
          <input
            className="form-check"
            type="checkbox"
            id="auto-update"
            value="auto-update"
            checked={autoUpdate}
            onChange={(e) => setAutoUpdate(!autoUpdate)}
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label" for="search-limit">
            Max
          </label>
          <input
            className="form-control"
            type="number"
            id="search-limit"
            value={searchLimit}
            onChange={(e) => setSearchLimit(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label" for="search-key">
            Key
          </label>
          <input
            className="form-control"
            type="text"
            id="search-key"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <div className="form-group mt-3">
          <label className="form-label" for="search-value">
            Value
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search.."
            style={{ width: 200 }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary mt-3"
          disabled={autoUpdate}
          onClick={() => {
            onParamsChange &&
              onParamsChange(searchKey, searchValue, searchLimit);
          }}
        >
          Query
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
