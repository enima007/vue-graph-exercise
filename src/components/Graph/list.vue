<script  lang="ts">
import { useGraphListStore } from '@/stores/graph';
import { storeToRefs } from 'pinia';
import moment  from "moment";
export default {
    setup(props, ctx: any) {
        const dateFormatter = (date : Date) => { 
            return  moment(date).format('YYYY-MM-DD hh:mm:ss')
        }
        
        const store = useGraphListStore();
        const { list } = storeToRefs(store);
        const fields = [
            {
                key:'id',
            }, 
            {
                key:'name',
            }, 
            {
                key:'description',
            }, 
            {
                key:'created_at',
                formatter : dateFormatter,
            }, 
            {
                key:'updated_at',
                formatter : dateFormatter,
            }, 
            {
                key:'actions',
            }
        ];

        let graphIdToDelete: number = -1;
        const items = list;

        return {
            fields,
            items,
            store,
            graphIdToDelete,
        }
    },
    methods: {
        deleteConfirm() {
            this.$bvModal.msgBoxConfirm('Do you want to delete this graph?', {
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
                if(value == true && this.graphIdToDelete >= 0) {
                    this.store.delete(this.graphIdToDelete);
                }
            })
            .catch(err => {
                console.error(err);
            })
        },
        newGraph() {
            this.$router.push({name:'graph-create'})
        },
        editGraph(row:any ){
            this.$router.push({name:'graph-edit', params:{id:row.id}})
        },
        statistics(row:any ){
            this.$router.push({name:'graph-stats', params:{id:row.id}})
        },
        deleteGraph(row:any ) {
            this.graphIdToDelete = row.id;
            this.deleteConfirm()    
        }
    }
}
</script>

<template>
    <div>
        <b-row class="mt-3 mb-3">
            <b-col cols="10">
                <h2>Graph list</h2>
            </b-col>
            <b-col cols="2" align-self="end" class="text-right">
                <b-button size="sm"  @click="newGraph()" variant="success" align-self="end" text-align="right"><b-icon icon="plus-lg"></b-icon></b-button>
            </b-col>
        </b-row>
        <b-table striped hover :items="items" :fields="fields">
            <template #cell(actions)="row">
                <b-button size="sm"  @click="editGraph(row.item)" class="mr-2">
                    Edit
                </b-button>
                <b-button size="sm"  @click="deleteGraph(row.item)" class="mr-2">
                    Delete
                </b-button>
                <b-button size="sm"  @click="statistics(row.item)" class="mr-2">
                    Statistics
                </b-button>
            </template>
        </b-table>
    </div>
</template>
  
