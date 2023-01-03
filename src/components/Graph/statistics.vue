<script  lang="ts">
import { useGraphListStore } from '@/stores/graph';
import moment  from "moment";
import type { Graph } from '@/lib/graph';
import type { Node } from '@/lib/node';

export default {
    setup(props, ctx: any) {
        const dateFormatter = (date : Date) => { 
            return  moment(date).format('YYYY-MM-DD hh:mm:ss')
        }
        
        const store = useGraphListStore();
        const fields = [
            {
                key:'id',
            }, 
            {
                key:'tooltip',
            }, 
            {
                key:'nighbours',
            }
        ];

        let created_at : string="", updated_at: string="";
        let items :Node[] = [];
        return {
            fields,
            items,
            store,
            dateFormatter,
            created_at,
            updated_at
        }
    },
    created () {
      this.fetchData();
    },
    methods: {
        fetchData () {
            const currentGrqphId = this.$route.params.id
            const graph : Graph = this.store.graphs.find((e:any) => e.id == parseInt(currentGrqphId))
            if(graph) {
                this.items = graph.nodes;
                this.created_at  = this.dateFormatter(graph.created_at);
                this.updated_at = this.dateFormatter(graph.updated_at);
            } 
        },
    }
}
</script>

<template>
    <div>
        <b-row class="mt-3 mb-3">
            <b-col cols="10">
                <h2>Graph statistics</h2>
            </b-col>
        </b-row>
        <b-table striped hover :items="items" :fields="fields">
        </b-table>
    </div>
</template>
  
