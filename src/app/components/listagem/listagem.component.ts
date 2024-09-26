import { NgClass, NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CoresBackgroundTipo } from '../../models/cores-background-tipo';
import { Pokemon } from '../../models/pokemon';
import { PokeApiService } from '../../services/poke-api.service';
import { converterParaTitleCase } from '../../util/converter-para-title-case';
import { TipoPokemon } from '../../models/tipo-pokemon';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterLink } from '@angular/router';
import { mapearTipoPokemon } from '../../util/mapear-tipo-pokemon';

@Component({
  selector: 'app-listagm',
  standalone: true,
  imports: [NgForOf, NgClass, RouterLink],
  templateUrl: './listagem.component.html',
  styleUrl: './listagem.component.scss'
})
export class ListagemComponent implements OnInit{
  public pokemons: Pokemon[];

  public coresBackgroundTipo: CoresBackgroundTipo = {
    Normal: 'fundo-tipo-normal',
    Fire: 'fundo-tipo-fogo',
    Water: 'fundo-tipo-agua',
    Electric: 'fundo-tipo-eletrico',
    Ice: 'fundo-tipo-gelo',
    Grass: 'fundo-tipo-grama',
    Bug: 'fundo-tipo-inseto',
    Poison: 'fundo-tipo-veneno',
    Flying: 'fundo-tipo-voador',
    Ground: 'fundo-tipo-terra',
    Rock: 'fundo-tipo-pedra',
    Fighting: 'fundo-tipo-lutador',
    Psychic: 'fundo-tipo-psiquico',
    Ghost: 'fundo-tipo-fantasma',
    Dark: 'fundo-tipo-sombrio',
    Fairy: 'fundo-tipo-fada',
    Steel: 'fundo-tipo-aco',
  };

  private offsetPaginação: number;

  constructor(private pokeApiService : PokeApiService) {
    this.pokemons = [];
    this.offsetPaginação = 0;
  }

  public ngOnInit(): void {
    this.obterPokemons();
  }

  public buscarMaisResultados(): void {
    this.offsetPaginação += 20;

    this.obterPokemons();
  }

  private obterPokemons(){
    this.pokeApiService.selecionarTodos(this.offsetPaginação).subscribe((res) =>{
      const arrayResultados = res.results as any[];

      for(let resultado of arrayResultados) {
        this.pokeApiService.selecionarDetalhesPorUrl(resultado.url).subscribe((objDetalhes: any)=> {
          const pokemon = this.mapearPokemon(objDetalhes);

          this.pokemons.push(pokemon);
        })
      }

      this.pokemons.sort((p) => p.id);
    });
  }


  private mapearPokemon(obj: any): Pokemon {
    return {
      id: obj.id,
      nome: converterParaTitleCase(obj.name),
      urlSprite: obj.sprites.other.dream_world.front_default,
      tipos: obj.types.map(mapearTipoPokemon),
    };
  }

}
