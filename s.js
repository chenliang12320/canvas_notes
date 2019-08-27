// https://observablehq.com/@d3/kernel-density-estimation@109
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Kernel Density Estimation

[Kernel density estimation](https://en.wikipedia.org/wiki/Kernel_density_estimation), or KDE, estimates the probability distribution of a random variable. The kernel’s *bandwidth* determines the estimate’s smoothness: if the bandwidth is too small, the estimate may include spurious bumps and wiggles; too large, and the estimate reveals little about the underlying distribution.

This example, based on [work by John Firebaugh](https://bl.ocks.org/jfirebaugh/900762), shows times between eruptions of [Old Faithful](https://en.wikipedia.org/wiki/Old_Faithful). See also a [two-dimensional density estimation](/@d3/density-contours) of this data.`
)});
  main.variable(observer("viewof bandwidth")).define("viewof bandwidth", ["html"], function(html)
{
  const form = html`<form>
  <input name=i type=range min=1 max=20 value=7 step=any style="width:180px;">
  <output style="font-size:smaller;font-style:oblique;" name=o></output>
</form>`;
  form.i.oninput = () => form.o.value = `${(form.value = form.i.valueAsNumber).toFixed(1)} bandwidth`;
  form.i.oninput();
  return form;
}
);
  main.variable(observer("bandwidth")).define("bandwidth", ["Generators", "viewof bandwidth"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","width","height","bins","x","y","data","density","line","xAxis","yAxis"], function(d3,width,height,bins,x,y,data,density,line,xAxis,yAxis)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
      .attr("fill", "#bbb")
    .selectAll("rect")
    .data(bins)
    .join("rect")
      .attr("x", d => x(d.x0) + 1)
      .attr("y", d => y(d.length / data.length))
      .attr("width", d => x(d.x1) - x(d.x0) - 1)
      .attr("height", d => y(0) - y(d.length / data.length));

  svg.append("path")
      .datum(density)
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("d", line);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  return svg.node();
}
);
  main.variable(observer("kde")).define("kde", ["d3"], function(d3){return(
function kde(kernel, thresholds, data) {
  return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
}
)});
  main.variable(observer("epanechnikov")).define("epanechnikov", function(){return(
function epanechnikov(bandwidth) {
  return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
}
)});
  main.variable(observer("line")).define("line", ["d3","x","y"], function(d3,x,y){return(
d3.line()
    .curve(d3.curveBasis)
    .x(d => x(d[0]))
    .y(d => y(d[1]))
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleLinear()
    .domain(d3.extent(data)).nice()
    .range([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","bins","data","height","margin"], function(d3,bins,data,height,margin){return(
d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length) / data.length])
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width","data"], function(height,margin,d3,x,width,data){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .call(g => g.append("text")
        .attr("x", width - margin.right)
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .text(data.title))
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y"], function(margin,d3,y){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, "%"))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer("thresholds")).define("thresholds", ["x"], function(x){return(
x.ticks(40)
)});
  main.variable(observer("density")).define("density", ["kde","epanechnikov","bandwidth","thresholds","data"], function(kde,epanechnikov,bandwidth,thresholds,data){return(
kde(epanechnikov(bandwidth), thresholds, data)
)});
  main.variable(observer("bins")).define("bins", ["d3","x","thresholds","data"], function(d3,x,thresholds,data){return(
d3.histogram()
    .domain(x.domain())
    .thresholds(thresholds)
  (data)
)});
  main.variable(observer("data")).define("data", ["d3"], async function(d3){return(
Object.assign(await d3.json("https://gist.githubusercontent.com/mbostock/4341954/raw/99757f8851178fbf60ff2173f322d1eb702d250f/faithful.json"), {title: "Time between eruptions (min.)"})
)});
  main.variable(observer("height")).define("height", function(){return(
500
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 20, right: 30, bottom: 30, left: 40}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}