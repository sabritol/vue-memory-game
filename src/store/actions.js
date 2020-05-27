import * as mutations from './mutations.type'
import { includes } from 'lodash-es'

const loadPokemon = ({ commit }) => {
  commit(mutations.setIsLoading, true)
  commit(mutations.setIsRunning, false)
  commit(mutations.resetSelecteds)
  commit(mutations.resetFound)
  commit(mutations.resetFailures)
  commit(mutations.resetScore)

  return fetch('/pokemon.json')
    .then(response => response.json())
    .then(data => {
      commit(mutations.setError, '')
      commit(mutations.setPokemonRawList, [...data])
      return new Promise(resolve => {
        setTimeout(() => {
          commit(mutations.setIsRunning, true)
          commit(mutations.setIsLoading, false)
        }, 500)
      })
    })
    .catch(err => {
      commit(mutations.setIsLoading, false)
      commit(mutations.setError, err.message)
    })
}

const selectPokeCard = ({ commit, state }, pokemon) => {
  const { found, selecteds } = state

  if (includes(found, pokemon.id) || includes(selecteds, pokemon.index)) {
    return
  }

  commit(mutations.addSelected, pokemon.index)
}

const setLevel = ({ commit, dispatch }, level) => {
  commit(mutations.setLevel, level)

  return dispatch('loadPokemon')
}

const setIsEasyMode = ({ commit, dispatch }, value) => {
  commit(mutations.setIsEasyMode, value)

  return dispatch('loadPokemon')
}

const setIsRouletteMode = ({ commit, dispatch }, value) => {
  commit(mutations.setIsRouletteMode, value)

  return dispatch('loadPokemon')
}

const addFound = ({ commit, state, getters }, id) => {
  const { nextScoreIncrement } = getters

  commit(mutations.addFound, id)
  commit(mutations.addScore, nextScoreIncrement)
  commit(mutations.resetFailures)
}

export default { loadPokemon, selectPokeCard, setLevel, addFound, setIsEasyMode, setIsRouletteMode }
