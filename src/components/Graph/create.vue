<template>
    <div>
      <b-row class="mt-3 mb-3">
        <b-col cols="10">
            <h2>New graph</h2>
        </b-col>
      </b-row>
      <b-form @submit="onSubmit" @reset="onReset" >
        <b-form-group id="graph-name-fg" label="Name:" label-for="graph-name">
          <b-form-input
            id="graph-name"
            v-model="form.name"
            placeholder="Enter graph name"
            required
          ></b-form-input>
        </b-form-group>
  
        <b-form-group id="graph-desc-fg" label="Description:" label-for="graph-desc">
          <b-form-textarea
            id="graph-desc"
            v-model="form.description"
            placeholder="Enter graph description"
            rows="1"
            max-rows="3"
            required
          ></b-form-textarea>
        </b-form-group>
        
        <b-button type="submit" variant="primary" class="mr-2">Submit</b-button>
        <b-button type="reset" variant="danger">Cancel</b-button>
      </b-form>
    </div>
  </template>
  
<script lang="ts">
  import { useGraphListStore } from '@/stores/graph';
  import { storeToRefs } from 'pinia';

  export default {
    setup () {
      const store = useGraphListStore();
      const { list, selectedGraph } = storeToRefs(store);
      return { store, list, selectedGraph };
    },
    data() {
      return {
        form: {
          name: '',
          description: '',
        }
      }
    },
    methods: {
      onSubmit(event: any) {
        event.preventDefault()
        this.store.create(this.form.name, this.form.description);
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
        // Trick to reset/clear native browser form validation state
        this.$nextTick(() => {
        })
      }
    }
  }
</script>