const width = 800;
const height = 500;
const padding = 60;

const svg = d3.select("#scatterplot")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("#tooltip");

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
  .then(data => {
    data.forEach(d => {
      d.Time = new Date(`1970-01-01T00:${d.Time}`);
    });

    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1])
      .range([padding, width - padding]);

    const yScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.Time))
      .range([padding, height - padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.Year))
      .attr("cy", d => yScale(d.Time))
      .attr("r", 6)
      .attr("data-xvalue", d => d.Year)
      .attr("data-yvalue", d => d.Time.toISOString())
      .attr("fill", d => d.Doping ? "#d62728" : "#1f77b4")
      .on("mouseover", (event, d) => {
        tooltip.style("opacity", 0.9)
          .html(
            `${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d3.timeFormat("%M:%S")(d.Time)}<br>${d.Doping}`
          )
          .attr("data-year", d.Year)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    const legend = d3.select("body")
      .append("div")
      .attr("id", "legend");

    legend.append("div").html(`<span style="color:#1f77b4;">&#9679;</span> No Doping Allegations`);
    legend.append("div").html(`<span style="color:#d62728;">&#9679;</span> Riders with Doping Allegations`);
  });
