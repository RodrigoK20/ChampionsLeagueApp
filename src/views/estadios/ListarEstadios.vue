<template>
  <v-container
    id="ListarEstadios"
    fluid
    tag="section"
  >
    <v-btn
      to="/crear"
      fab
      dark
      color="blue"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <base-material-card
      id="lista"
      icon="mdi-clipboard-text"
      title="Estadios"
      class="px-5 py-3"
    >
      <v-simple-table
        id="tabla"
        fixed-header
        class="elevation-3"
        :search="search"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Estadio</th>
            <th>Pais</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="estadio in estadios"
            :key="estadio.id"
          >
            <td>{{ estadio.id_estadio }}</td>
            <td>{{ estadio.nombre_estadio }}</td>
            <td>{{ estadio.pais }}</td>
            <td>{{ estadio.ciudad }}</td>

            <td>
              <v-btn
                :to="{name:'EditarEstadio',params:{id:estadio.id_estadio}}"
                fab
                small
                color="light-blue"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                fab
                small
                color="orange darken-4"
                @click.stop="dialog=true"
                @click="id=estadio.id_estadio"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>

    <!-- Ventana de diaglo para eliminar registros -->
    <v-dialog
      v-model="dialog"
      max-width="350"
    >
      <v-card>
        <v-card-title class="headline">
          ¿Desea eliminar el estadio?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog=false">
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            @click="confimarBorrado(id)"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import axios from 'axios'
  const url = 'http://localhost:30305/api/'

  export default {
    name: 'ListarEstadios',
    data () {
      return {
        search: '',
        dialog: false,
        estadios: null,
        id: '',
      }
    },
    mounted () {
      this.obtenerEstadios()
    },
    methods: {
      obtenerEstadios () {
        axios.get(url + 'Estadio/Get')
          .then(response => {
            this.estadios = response.data
          })
          .catch()
      },
      confimarBorrado (id) {
        axios.post(url + 'Estadio/Delete/' + id)
          .then(() => {
            this.obtenerEstadios()
            this.dialog = false
          })
      },

    },
  }
</script>

<style>

#tabla, th{
  font-family: Helvetica Neue, Arial, sans-serif;
  font-size: 104px;
}

</style>
