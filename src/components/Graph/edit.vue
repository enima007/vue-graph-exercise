<template>
  <div>
    <b-row class="mt-3 mb-3">
      <b-col cols="10">
        <h2>Edit graph</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="8">
        <b-form @submit="onSubmit" @reset="onReset">
          <b-form-group id="graph-name-fg" label="Name:" label-for="graph-name">
            <b-form-input id="graph-name" v-model="form.name" placeholder="Enter graph name" required></b-form-input>
          </b-form-group>

          <b-form-group id="graph-desc-fg" label="Description:" label-for="graph-desc">
            <b-form-textarea id="graph-desc" v-model="form.description" placeholder="Enter graph description" rows="1"
              max-rows="3" required>
            </b-form-textarea>
          </b-form-group>

          <b-button type="submit" variant="primary" class="mr-2">Submit</b-button>
          <b-button type="reset" variant="danger">Cancel</b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row>
      <h4 class="mt-4">Graph editor</h4>
    </b-row>
    <b-row>
      <b-col style="height: 650px; background-color: #f5f5f5;" class="mt-2" cols="12">
        <b-button @click="newNode" variant="success" class="m-2 mt-4">New Node</b-button>
        <p class="mt-2">To delete a node you just need to click on it.</p>
        <p>To create an edge between two nodes you have to click on the source node and drag till the target node.</p>
        <p>To delete an edge between two nodes you have to click on the source node and drag till the target node.</p>
        <svg id="mySVG" width="100%" height="450px" style="background-color:#f5f5f5"></svg>
      </b-col>
    </b-row>

    <b-modal id="node-modal" ref="modal" title="New node" @show="resetModal" @hidden="resetModal" @ok="createNode">
      <form ref="form">
        <b-form-group label="Tooltip" label-for="tooltip-input" invalid-feedback="Tooltip is required">
          <b-form-input id="tooltip-input" v-model="tooltip" required></b-form-input>
        </b-form-group>
      </form>
    </b-modal>

  </div>
</template>
  
<script lang="ts">
import { Graph } from '@/lib/graph';
import type { INode, Node } from '@/lib/node';
import { useGraphListStore } from '@/stores/graph';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import * as d3 from "d3";
export default {
  setup() {
    const store = useGraphListStore();
    const { list } = storeToRefs(store);
    const currentGraph = ref(new Graph({
      id: 0,
      name: '',
      description: '',
      nodes: Array<Node>()
    }))
    return { store, list, currentGraph };
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.initGraph();
  },
  watch: {
    '$route': 'fetchData'
  },
  data() {

    return {
      form: {
        name: '',
        description: '',
      },
      tooltip: '',
      nodeForm: {
        tooltip: '',
      },
      graph: { nodes: [], links: [] }
    }
  },
  methods: {
    deleteNodeConfirm(id: number) {
      this.$bvModal.msgBoxConfirm('Do you want to delete this node?', {
        title: 'Warning',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'YES',
        cancelTitle: 'NO',
        centered: true,
        noCloseOnBackdrop: true,
        noCloseOnEsc: true,
      })
        .then(value => {
          if (value == true) {
            this.currentGraph.removeNode(id);
            this.refreshGraphData(this.currentGraph)
            this.renderGraph();
          }
        })
        .catch(err => {
          console.error(err);
        })
    },

    deleteEdgeConfirm(src: number, dest: number) {
      this.$bvModal.msgBoxConfirm('Do you want to delete this edge?', {
        title: 'Warning',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'YES',
        cancelTitle: 'NO',
        centered: true,
        noCloseOnBackdrop: true,
        noCloseOnEsc: true,
      })
        .then(value => {
          if (value == true) {
            this.currentGraph.removeEdge(src, dest);
            this.refreshGraphData(this.currentGraph)
            this.renderGraph();
          }
        })
        .catch(err => {
          console.error(err);
        })
    },

    resetModal() {
      this.nodeForm.tooltip = ''
    },

    createNode(evt: any) {
      evt.preventDefault()
      const currentGrqphId = this.$route.params.id;
      this.currentGraph.addNode(this.tooltip);
      this.refreshGraphData(this.currentGraph)
      this.renderGraph();
      this.tooltip = "";
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('node-modal')
      })
    },

    newNode() {
      this.$bvModal.show('node-modal');
    },
    
    createEdge(src: number, dest: number) {
      if (src == dest) {
        return;
      }

      if (this.currentGraph.hasEdge(src, dest)) {
        this.deleteEdgeConfirm(src, dest);
      } else {
        this.currentGraph.addEdge(src, dest);
        this.refreshGraphData(this.currentGraph)
        this.renderGraph();
      }
    },

    onSubmit(event: any) {
      event.preventDefault()
      this.store.update(this.currentGraph.id, this.form.name, this.form.description);
      this.resetForm()
      this.$router.push('/')
    },

    resetForm() {
      this.form.name = ''
      this.form.description = ''
    },

    onReset(event: any) {
      event.preventDefault();
      this.resetForm()
      this.$router.push('/');
    },

    fetchData() {
      const currentGrqphId = this.$route.params.id
      const temp = this.store.graphs.find((e: any) => e.id == parseInt(currentGrqphId))
      if (temp) {
        this.currentGraph = temp;
        this.form.name = temp.name;
        this.form.description = temp.description;
        this.refreshGraphData(temp);
      }
    },

    refreshGraphData(graph: any) {
      const nodes = graph.nodes.map((n: any) => ({ id: n.id, tooltip: n.tooltip }))
      const links = graph.nodes.reduce(
        (acc: any, n: any) => {
          n.nighbours.forEach((nighbour: number) => {
            acc.push({
              source: n.id,
              target: nighbour,
              type: ""
            })
          });
          return acc;
        }, []);
      this.graph.nodes = nodes;
      this.graph.links = links;
    },
    initGraph() {
      this.renderGraph();
    },
    renderGraph() {
      const mySVG = document.getElementById("mySVG");
      if (!mySVG) {
        return;
      }
      mySVG.innerHTML = "";
      const width = 960, height = 500;
      let srcNode: INode | null = null;
      const nodes = this.graph.nodes.map((d: INode) => Object.create({
        id: d.id,
        tooltip: d.tooltip
      }));

      const links = this.graph.links.map((d: any) => Object.create({ source: d.source, target: d.target }));

      function linkArc(d: any) {
        const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
        return `
            M${d.source.x},${d.source.y}
            A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
          `;
      }

      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id((d: any) => d.id))
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

      const svg = d3.create("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .style("font", "12px sans-serif");

      const selectSrcNode = (n: INode) => {
        srcNode = n;
      }

      const selectDestNode = (destNode: INode) => {
        if (!srcNode) {
          return;
        }
        this.createEdge(srcNode.id, destNode.id)
        srcNode = null;
      }

      const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", "black")
      // .attr("marker-end", d => `url(#arrow-${d.type}`);

      const node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .on("mousedown", (e, d) => {
          selectSrcNode(d)
        })
        .on("mouseup", (e, d) => {
          selectDestNode(d)
        })
        .on("click", (e, d) => {
          this.deleteNodeConfirm(d.id)
        })

      node.append("circle")
        .attr("stroke", "black")
        .attr("fill", "white")
        .attr("stroke-width", 1.5)
        .attr("r", 20)

      node.append("text")
        .attr("x", -3)
        .attr("y", "0.31em")
        .text((d: any) => d.id)
        .clone(true).lower()
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 3);

      node.append("text")
        .attr("x", 25)
        .attr("y", "0.31em")
        .text((d: any) => d.tooltip)

      simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
      });

      const container = d3.select(mySVG);
      container.append(() => svg.node());
    }
  }
}
</script>