import React, { useEffect, useState } from "react";
import moment from "moment";
import * as styles from "./styles";
import "../css/App.css";
import { materialColor } from "./materials";

function View() {
  //   const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  //   const [endDate, setEndDate] = useState(
  //     moment(moment()).add(1, "d").format("YYYY-MM-DD")
  //   );
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM"));
  const [startDate, setStartDate] = useState(
    moment(selectedDate).startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(selectedDate).endOf("month").format("YYYY-MM-DD")
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [metricsData, setMetricsData] = useState({});
  const [goalsData, setGoalsData] = useState({});
  const [scheduleData, setScheduleData] = useState({});

  const [scheduleOutline, setScheduleOutline] = useState([]);

  const style_attainment_container = {
    display: "grid",
    gridTemplateColumns: "49% 49%",
    gridTemplateRows: "repeat(1, 1fr)",
    justifyContent: "space-between",
    height: "",
    position: "relative",
  };

  const style_schedule_container_header = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gridTemplateRows: "repeat(1, 1fr)",
  };

  const style_schedule_container_body = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gridTemplateRows: "20rem 20rem 20rem 20rem 20rem",
    gap: "1%",
  };

  const style_days_of_the_week = {
    textAlign: "center",
    color: "#D9D9D9",
    fontSize: "1.5rem",
  };

  const fetchData = async (url, setData) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  function fetchMonthDays(year, month) {
    const daysInMonth = [];

    // Start at the first day of the month
    const startOfMonth = moment([year, month - 1]); // Month is zero-based in Moment.js

    const numberOfDays = startOfMonth.daysInMonth(); // Get number of days in the month

    for (let i = 0; i < numberOfDays; i++) {
      daysInMonth.push(
        startOfMonth.clone().add(i, "days").format("YYYY-MM-DD")
      );
    }
    return daysInMonth;
  }

  useEffect(() => {
    setLoading(true);
    fetchData(
      `http://localhost:5000/api/metrics/extruder?start_date=${startDate}&end_date=${endDate}`,
      (data) => setMetricsData(data)
    );
  }, [startDate, endDate]);

  useEffect(() => {
    setLoading(true);
    fetchData(
      `http://localhost:5000/api/goals/extruder?start_date=${startDate}&end_date=${endDate}`,
      (data) => setGoalsData(data)
    );
  }, [startDate, endDate]);

  useEffect(() => {
    setLoading(true);
    fetchData(
      `http://localhost:5000/api/schedule?start_date=${startDate}&end_date=${endDate}`,
      (data) => setScheduleData(data)
    );
  }, [startDate, endDate]);

  useEffect(() => {
    const dateRange = fetchMonthDays(
      moment(selectedDate).format("YYYY"),
      moment(selectedDate).format("MM")
    );
    console.log("dateRange", dateRange);

    const firstDayOfMonth = moment(dateRange[0]).day(); // Sunday = 0, Monday = 1, etc.

    // Create a padded array to align dates with correct weekdays
    const paddedDates = Array(firstDayOfMonth).fill(null).concat(dateRange);

    // Break the array into chunks of 7 (representing weeks)
    const weeks = [];
    for (let i = 0; i < paddedDates.length; i += 7) {
      weeks.push(paddedDates.slice(i, i + 7));
    }
    setScheduleOutline(weeks);
  }, [selectedDate]);

  const handleChange = (e) => {
    console.log(e.target.value); // e.target.value is in the format YYYY-MM
    setSelectedDate(e.target.value);

    // Use Moment.js to calculate the first and last days of the selected month
    const startDate = moment(e.target.value)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = moment(e.target.value).endOf("month").format("YYYY-MM-DD");

    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <div className="view-root" style={styles.page_root}>
      <form>
        <input
          id="monthYear"
          type="month"
          value={selectedDate}
          onChange={handleChange}
          placeholder="Select a month and year"
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "1.25rem",
            border: "1px solid #DDDDDD",
            borderRadius: "0.5rem",
            height: "3rem",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#3b82f6";
            e.target.style.boxShadow = "0 0 5px rgba(59, 130, 246, 0.3)";
            e.target.style.outline = "none";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#DDDDDD";
            e.target.style.boxShadow = "none";
            e.target.style.outline = "none";
          }}
        />
      </form>
      <div
        className="view-title"
        style={{
          fontSize: "4rem",
          color: "#D9D9D9",
          justifyContent: "center",
          width: "100%",
          letterSpacing: "0.5rem",
          textAlign: "center",
          marginBottom: "2rem",
          marginTop: "5rem",
        }}
      >
        <div className="">
          {" "}
          &gt; {moment(selectedDate).format("MMMM ' YY").toUpperCase()}
        </div>
      </div>
      <div
        className="view-edit-targets"
        style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
      >
        <div className="view-edit-ovens" style={styles.view_button}>
          EDIT OVENS
        </div>
        <div className="view-edit-schedule" style={styles.view_button}>
          EDIT SCHEDULE
        </div>
        <div className="view-edit-goal" style={styles.view_button}>
          EDIT GOALS
        </div>
      </div>
      <div
        className="view-monthly-attainment"
        style={{ marginTop: "2rem", ...style_attainment_container }}
      >
        <div
          className="view-material-attainement"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            flexGrow: 0.5,
            gridColumn: "1",
            gridRow: "1",
          }}
        >
          {/* {JSON.stringify(metricsData["spools_created"])} */}
          {metricsData &&
            metricsData["spools_created"] &&
            goalsData &&
            goalsData.raw &&
            Object.keys(metricsData["spools_created"]).map(
              (material_id, idx) => (
                <div
                  key={idx}
                  className=""
                  style={{
                    display: "flex",
                    border: "1px solid #D9D9D9",
                    borderRadius: "0.5rem",
                  }}
                >
                  <div
                    className=""
                    style={{
                      borderTopLeftRadius: "0.5rem",
                      borderBottomLeftRadius: "0.5rem",
                      padding: "0.25rem 0.75rem",
                      backgroundColor: materialColor[material_id] + "E6",
                      color: "#FFFFFF",
                      letterSpacing: "2px",
                      fontSize: "1.25rem",
                      fontWeight: 200,
                    }}
                  >
                    {material_id}
                  </div>
                  {Object.keys(metricsData["spools_created"][material_id]).map(
                    (status, jdx) => (
                      <div
                        key={`${idx}-${jdx}`}
                        className=""
                        style={{
                          flexBasis: `${
                            ((metricsData["spools_created"][material_id][
                              status
                            ] |
                              1) *
                              100) /
                            goalsData.raw[material_id]
                          }%`,
                          //   border: "1px solid blue",
                          textAlign: "right",
                          backgroundColor: materialColor[material_id] + "E6",
                          padding: "0.5rem",
                          borderTopRightRadius: `${jdx === 2 ? 0.5 : 0}rem`,
                          borderBottomRightRadius: `${jdx === 2 ? 0.5 : 0}rem`,
                          color: "white",
                          //   borderRadius: "0.5rem",
                        }}
                      >
                        {metricsData["spools_created"][material_id][status]}
                      </div>
                    )
                  )}
                  <div
                    className="goal"
                    style={{
                      textAlign: "right",
                      flexGrow: 1,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textDecoration: "underline",
                      verticalAlign: "center",
                      padding: "0.5rem",
                      color: "#BDBDBD",
                    }}
                  >
                    {goalsData.raw[material_id]}
                  </div>
                </div>
              )
            )}
        </div>
        <div
          className="view-material-attainment-graph"
          style={{
            border: "1px solid #3290FF",
            color: "#3290FF",
            borderRadius: "1rem",
            padding: "1rem",
            gridColumn: "2",
            gridRow: "1",
          }}
        >
          graph goes here...
        </div>
      </div>
      <div
        className="view-monthly-schedule"
        style={{
          color: "black",
          marginTop: "2rem",
          ...style_schedule_container_header,
        }}
      >
        <div
          className=""
          style={{ gridRow: "1", gridColumn: "1", ...style_days_of_the_week }}
        >
          S
        </div>
        <div
          className=""
          style={{ gridRow: "1", gridColumn: "2", ...style_days_of_the_week }}
        >
          M
        </div>
        <div
          className=""
          style={{ gridRow: "1", gridColumn: "3", ...style_days_of_the_week }}
        >
          T
        </div>
        <div
          className=""
          style={{ gridRow: "1", gridColumn: "4", ...style_days_of_the_week }}
        >
          W
        </div>
        <div
          className=""
          style={{ gridRow: "1", gridColumn: "5", ...style_days_of_the_week }}
        >
          T
        </div>
        <div
          className=""
          style={{ gridRow: "1", gridColumn: "6", ...style_days_of_the_week }}
        >
          F
        </div>
        <div
          className=""
          style={{ gridRow: "1", gridColumn: "7", ...style_days_of_the_week }}
        >
          S
        </div>
      </div>
      <div
        className="view-monthly-schedule"
        style={{
          color: "black",
          marginTop: "2rem",
          ...style_schedule_container_body,
        }}
      >
        {scheduleOutline &&
          scheduleData &&
          scheduleOutline.map(
            (week, xdx) =>
              // <div className="" style={{ gridColumn: "1 /7", border: "1px solid blue"}}>
              week.map((day, ydx) => (
                <div
                  style={{
                    gridRow: xdx + 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div
                    className=""
                    style={{
                      textAlign: "center",
                      color: day ? "#D9D9D9" : "#FFFFFF",
                      fontSize: "1.25rem",
                    }}
                  >
                    {(day && moment(day).format("D")) || 0}
                  </div>
                  <div
                    className=""
                    style={{
                      gridRow: xdx + 1,
                      gridColumn: ydx + 1,
                      border: "1px solid #D9D9D9",
                      borderRadius: "0.5rem",
                      height: "10rem",
                    }}
                    // needs goals based on the first shift goals for available
                  >
                    {Object.keys(scheduleData.monthly_schedule).map(
                      (entry, zdx) => (
                        <div className="">
                          {(entry.date && moment(entry.date).format("D")) ===
                          (day && moment(day).format("D"))
                            ? entry.material_id
                            : ""}
                        </div>
                      )
                    )}
                  </div>
                  <div
                    className=""
                    style={{
                      gridRow: xdx + 1,
                      gridColumn: ydx + 1,
                      border: "1px solid #D9D9D9",
                      backgroundColor: "#D9D9D9",
                      borderRadius: "0.5rem",
                      height: "10rem",
                    }}
                    // needs goals based on the first shift goals for available
                  ></div>
                </div>
              ))

            // </div>
          )}
      </div>
    </div>
  );
}
export default View;
