let selArtist;
class TreeVis {
    constructor(targetElementId, data) {
        this.margin = { top: 10, right: 10, bottom: 10, left: 40 };
        this.treewidth = 1100 - this.margin.left - this.margin.right;
        this.treeheight = 800 - this.margin.top - this.margin.bottom;
        this.data = data;
        this.targetElementId = targetElementId;

        this.initVis();

        this.setupTileClick()
    }

    initVis() {
        this.createSVG();
        this.createTreeMap();
    }

    createSVG() {
        this.treesvg = d3
            .select(`#${this.targetElementId}`)
            .append('svg')
            .attr('width', this.treewidth + this.margin.left + this.margin.right)
            .attr('height', this.treeheight + this.margin.top + this.margin.bottom)
            .append('g')
            .attr(
                'transform',
                'translate(' + this.margin.left + ',' + this.margin.top + ')'
            );
    }

    createTreeMap() {
        var root = d3.hierarchy(this.data).sum(function (d) {
            return d.value;
        });

        d3.treemap()
            .size([this.treewidth, this.treeheight])
            .paddingTop(28)
            .paddingRight(7)
            .paddingInner(3)(root);

        var color = d3
            .scaleOrdinal()
            .domain(['Pop', 'Rock', 'Classical', 'Rock', "Jaz"])
            .range(["#FF8C94", "#FFDAB9", "#DAA520",
                "#F0E68C", "#FFE4E1", "#F08080", "#FF6347", "#CD5C5C", "#FF69B4", "#9370DB",
                "#DDA0DD"]);

        var opacity = d3.scaleLinear().domain([10, 30]).range([0.5, 1]);

        this.treesvg
            .selectAll('rect')
            .data(root.leaves())
            .enter()
            .append('rect')
            .attr('x', (d) => d.x0)
            .attr('y', (d) => d.y0)
            .attr('width', (d) => d.x1 - d.x0)
            .attr('height', (d) => d.y1 - d.y0)
            .style('stroke', 'black')
            .style('fill', (d) => color(d.parent.data.name))
            .style('opacity', (d) => opacity(d.data.value));

        this.treesvg
            .selectAll('text')
            .data(root.leaves())
            .enter()
            .append('text')
            .attr('x', (d) => d.x0 + 5)
            .attr('y', (d) => d.y0 + 20)
            .text((d) => d.data.name.replace('mister_', ''))
            .attr('font-size', '14px')
            .attr('fill', 'white');

        this.treesvg
            .selectAll('vals')
            .data(root.leaves())
            .enter()
            .append('text')
            .attr('x', (d) => d.x0 + 5)
            .attr('y', (d) => d.y0 + 35)
            .text((d) => d.data.value)
            .attr('font-size', '11px')
            .attr('fill', 'white');

        this.treesvg
            .selectAll('titles')
            .data(root.descendants().filter((d) => d.depth == 1))
            .enter()
            .append('text')
            .attr('x', (d) => d.x0)
            .attr('y', (d) => d.y0 + 21)
            .text((d) => d.data.name)
            .attr('font-size', '19px')
            .attr('fill', (d) => color(d.data.name));

    }
    setupTileClick() {
        const vis = this;

        this.treesvg.selectAll('rect').on('click', (event, d) => {
            selArtist = d.data.name;
            this.emitArtistSelectedEvent(selArtist);
        });
    }

    emitArtistSelectedEvent(artist) {
        // Create and dispatch a custom event
        const artistSelectedEvent = new CustomEvent('artistSelected', { detail: artist });
        document.dispatchEvent(artistSelectedEvent);
    }
}