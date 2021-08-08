<template>
  <v-container
    id=""
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
          color="red"
          to="/torneos"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-arrow-left-thick</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Registrar Jugador</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="nombre_jugador"
                  autofocus
                  clearable
                  class="inputRef"
                  label="Nombre Jugador*"
                  type="text"
                  required
                  :rules="[() => nombre_jugador.length > 0 || 'Campo requerido']"
                />
              </v-col>

              <v-col cols="12">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="Fecha Nacimiento*"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="date"
                    no-title
                    scrollable
                  >
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="menu = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu.save(date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="posicion"

                  clearable
                  class="inputRef"
                  label="Posición*"
                  type="text"
                  required
                  :rules="[() => posicion.length > 0 || 'Campo requerido']"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="dorsal"

                  clearable
                  class="inputRef"
                  label="Dorsal*"
                  type="number"
                  required
                  :rules="[() => dorsal.length > 0 || 'Campo requerido']"
                />
              </v-col>

              <v-col cols="12">
                <span>Seleccionar Equipo: </span>
                <select
                  id="select1"
                  v-model="equipo_id"
                  required
                >
                  <option
                    v-for="equipo in equipos"
                    :key="equipo.id_equipo"
                    :value="equipo.id_equipo"
                  >
                    {{ equipo.nombre_equipo }}
                  </option>
                </select>
              </v-col>

              <v-col
                cols="12"
                sm="6"
              >
                <input
                  label="Logo*"
                  type="file"
                  @change="imageUpload"
                >
              </v-col>
            </v-row>
          </v-container>
          <small>*Campos obligatorios</small>
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
            @click="guardarJugador()"
          >
            Guardar
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <base-material-card
      id="lista"
      icon="mdi-alarm-multiple"
      title="Partidos del Torneo"
      class="px-5 py-3"
    >
      <v-card-title>
        Partidos
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
        :items="partidos"
        :search="search"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            color="green dark"
            fab
            small
            :to="{name:'RegistrarResultadoPartidoTorneo',params:{id:item.id_partido_x_torneo}}"
          >
            <v-icon>mdi-checkbox-marked-circle</v-icon>
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

    name: '',
    data () {
      return {
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    
        torneo_id: '',
        estadio_id: '',
        nombre_estadio: '',
        equipo_a: '',
        equipo_b: '',
        fecha_partido: '',
        hora: '',
        numero_partido: '',

        search: '',
        partidos:[],

        headers: [
          { text: 'Equipo 1', value: 'equipo_a' },
          { text: 'Equipo 2', value: 'equipo_b' },
          { text: 'Estadio', value: 'nombre_estadio' },
          { text: 'Resultado Equipo 1', value: 'resultado_a' },
          { text: 'Resultado Equipo 2', value: 'resultado_b' },
          { text: 'Fecha partido', value: 'fecha_partido' },
          { text: 'Hora', value: 'hora' },
          { text: '# Partido', value: 'numero_partido' },
          { text: 'Estado', value: 'estado_partido' },
          { text: 'Acciones', value: 'actions', sortable: false },

        ],
        /* jugador: {

          nombre_jugador: '',
          fecha_nac: '',
          fotografia: '',
          posicion: '',
          dorsal: '',
          equipo_id: '',
        },
 */
      }
    },
    mounted () {
      this.obtenerPartidos()
    },
    methods: {

      getFile (event) {
        this.file = event.target.files[0]
        console.log(this.file)
      },

      obtenerPartidos () {
        this.id = this.$route.params.id
        this.axios.get(url + 'Torneo/PartidosTorneo/' + this.id)
          .then(response => {
            console.log(response)
            this.partidos = response.data
          })
          .catch((error) => {
            console.log(error)
          })
      },



    },
  }

</script>

<style>
#select1{
display: block;
  font-size: 16px;
  font-family: 'Verdana', sans-serif;
  font-weight: 400;
  color: #444;
  line-height: 1.3;
  padding: .4em 1.4em .3em .8em;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
 margin: 20px auto;
  border: 1px solid #aaa;
  box-shadow: 0 1px 0 1px rgba(0,0,0,.03);
  border-radius: .3em;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
    linear-gradient(to bottom, #ffffff 0%,#f7f7f7 100%);
  background-repeat: no-repeat, repeat;
  background-position: right .7em top 50%, 0 0;
  background-size: .65em auto, 100%;
}

tbody tr:nth-of-type(odd) {
   background-color: rgba(0, 0, 0, .05);
 }
</style>
