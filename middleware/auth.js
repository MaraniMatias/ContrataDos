// Guardar el token
export default async function ({ store, query }) {
  if (query?.token) {
    await store.commit('SET_TOKEN', query.token, { root: true })
    // TODO ger me save
  }
}
