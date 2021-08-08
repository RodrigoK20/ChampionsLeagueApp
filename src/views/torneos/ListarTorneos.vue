<template>
  <v-container
    id="ListarTorneos"
    fluid
    tag="section"
  >
    <v-dialog
      ref="modalEq"
      v-model="dialog"
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          dark
          color="blue"

          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Registrar Torneo</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="nombre"
                  autofocus
                  clearable
                  class="inputRef"
                  label="Nombre torneo*"
                  type="text"
                  required
                  :rules="[() => nombre.length > 0 || 'Campo requerido']"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="fecha_inicio"
                  clearable
                  class="inputRef"
                  label="Fecha inicio torneo*"
                  type="date"
                  required
                  :rules="[() => fecha_inicio.length > 0 || 'Campo requerido']"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="fecha_fin"
                  clearable
                  class="inputRef"
                  label="Fecha finalización torneo*"
                  type="date"
                  required
                  :rules="[() => fecha_finalizacion.length > 0 || 'Campo requerido']"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Cerrar
          </v-btn>
          <button
            color="blue darken-1"
            text
            @click="guardarTorneo()"
          >
            Guardar
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <base-material-card
      id="lista"
      icon="mdi-alarm-check"
      title="Lista de Torneos"
      class="px-5 py-3"
    >
      <v-card-title>
        Torneos
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>

      <v-data-table

        :headers="headers"
        :items="torneos"
        :search="search"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            color="dark green"
            fab
            :to="{name:'RegistrarEquipos',params:{id:item.id_torneo}}"
          >
            <v-icon>mdi-alert-circle</v-icon>
          </v-btn>

          <v-btn
            color="red"
            fab
            :to="{name:'RegistrarPartidos',params:{id:item.id_torneo}}"
          >
            <v-icon>mdi-clipboard-check</v-icon>
          </v-btn>

          <v-btn
            color="orange dark"
            fab
            :to="{name:'ListarPartidosTorneo',params:{id:item.id_torneo}}"
          >
            <v-icon>mdi-clipboard-edit-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
  import axios from 'axios'

  import Vue from 'vue'
  import VueSwal from 'vue-swal'
  const url = 'http://localhost:30305/api/'

  Vue.use(VueSwal)

  export default {

    name: 'ListarTorneos',
    data () {
      return {
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        // array select equipos
        torneos: [],
        menu: false,
        dialog: false,
        nombre: '',
        fecha_inicio: '',
        fecha_fin: '',
        search: '',

        headers: [
          { text: 'Nombre', value: 'nombre' },
          { text: 'Fecha inicio torneo', value: 'fecha_inicio' },
          { text: 'Fecha Finalización torneo', value: 'fecha_fin' },
          { text: 'Acciones', value: 'actions', sortable: false },

        ],
      }
    },
    mounted () {
        this.obtenerTorneos();
    },
    methods: {
      guardarTorneo () {
        // const router = this.$router

        // para saber que capturamos desde el navegador
        axios.post(url + 'Torneo/Add', {
          nombre: this.nombre,
          fecha_inicio: this.fecha_inicio,
          fecha_fin: this.fecha_fin,
        })
          .then((response) => {
            console.log(response)
            if (response.data === 'Ingrese correctamente los campos') {
              this.dialog = true
              this.$swal({
                icon: 'error',
                title: 'Error',
                text: 'Ingrese correctamente los campos',
                showConfirmButton: true,
              })
            } else if (response.data === 'El nombre del torneo ya se encuentra registrado') {
              this.dialog = true
              this.$swal({
                icon: 'warning',
                title: 'Advertencia',
                text: 'El nombre del torneo ya se encuentra registrado!',
                showConfirmButton: true,
              })
            } else {
              this.obtenerJugadores()
              this.$swal({
                icon: 'success',
                title: 'Torneo registrado correctamente',
                text: 'Guardado en la base de datos',
                showConfirmButton: false,
                timer: 2800,
              })
            }

            // router.push('/equipos')
            this.dialog = false
            this.nombre = ''
            this.fecha_inicio = ''
            this.fecha_fin = ''
          })
      },

      obtenerTorneos () {
        this.axios.get(url + 'Torneo/Get')
          .then(response => {
            console.log(response)
            this.torneos = response.data
          })
          .catch((error) => {
            console.log(error)
          })
      },
    },
  }

</script>
