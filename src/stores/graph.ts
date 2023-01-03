import { Graph } from '@/lib/graph'
import { defineStore } from 'pinia'

export const useGraphListStore = defineStore({
  id: 'graphlist',
  state: () => {
    let x : any  = null;
    if(localStorage.getItem('graphList')) {
      x = JSON.parse(localStorage.getItem('graphList')+'');
    }
    if(x) {
      x.graphs = x.graphs.map((g:any)=> new Graph(g))
    }
    return x?x:{
      graphs: new Array<Graph>,
      nextGraphId: 0,
      selectedGraph: null,
    }
  },
  getters: {
    list: (state) => state.graphs,
    nextId: (state) => state.nextGraphId,
  },
  actions: {
    create(name: string, description : string) {

      this.graphs.push(new Graph({id: this.nextGraphId++, name, description}));
    },
    update(id: number, name: string,  description: string) {
      const graph = this.graphs.find((e:any) => e.id == id);
      if(graph) {
        graph.name = name;
        graph.description = description;
        graph.updated_at = new Date();
      }
    },
    delete(id : number) {
      const graphIndex = this.graphs.findIndex((e:any) => e.id == id);
      if(graphIndex >= 0) {
        this.graphs.splice(graphIndex, 1);
      }
    }
  }
})
