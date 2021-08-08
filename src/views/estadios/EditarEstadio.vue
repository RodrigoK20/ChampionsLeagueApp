<template>
  <v-container>
    <v-row>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Editar Estadio
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <form @submit.prevent="actualizarEstadio()">
          <v-text-field
            v-model="estadio.id_estadio"
            label=""
            outlined
            required
          />

          <v-text-field
            v-model="estadio.nombre_estadio"
            label="Nombre"
            outlined
            required
          />

          <v-text-field
            v-model="estadio.pais"
            label="Pais"
            type="text"
            outlined
            required
          />

          <v-text-field
            v-model="estadio.ciudad"
            label="Ciudad"
            type="text"
            outlined
            required
          />

          <v-card-actions>
            <v-btn
              color="blue-grey"
              to="/estadios"
              class="mr-4"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="indigo"
              type="submit"
              class="mr-4"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

  import axios from 'axios'

  import Vue from 'vue'
  import VueSwal from 'vue-swal'
  const url = 'http://localhost:30305/api/'

  Vue.use(VueSwal)

  export default {
    name: 'EditarEstadio',

    data () {
      return {
        estadio: {
          id_estadio: '',
          nombre_estadio: '',
          pais: '',
          ciudad: '',
        },
      }
    },

    // Traer datos al formulario
    mounted () {
      this.id = this.$route.params.id
      axios.get(url + 'Estadio/GetEstadio/' + this.id)
        .then(response => {
          console.log(response)
          this.estadio = response.data[0]
        })
        .catch((error) => {
          console.log(error)
        })
    },

    methods: {
      actualizarEstadio () {
        // para saber que capturamos
        const router = this.$router
        // parametros
        const params = this.estadio
        axios.put(url + 'Estadio/Update/' + this.id, params)
          .then((response) => {
            // alert(response.data);
            if (response.status == 200) {
              this.$swal({
                icon: 'success',
                title: 'Estadio editado',
                text: 'Edición realizada correctamente',
                button: false,
                timer: 3500,
              })

              router.push('/estadios')
            }

            if (response.status == 201) {
              this.$swal({
                icon: 'error',
                title: 'Estadio duplicado ',
                text: 'Ya se encuentra el estadio con el mismo nombre registrado',
                button: false,
                timer: 3500,
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },

    },
  }
</script>
