class GamesController < ApplicationController

    def index
        games = Game.all
        render json: games, include: [:users]
      end

      def show
        
        game = Game.find_by_id(params[:id])
        
        render json: game.to_json( :include => {
            :users => {:only => [:name, :points]}
        })
    end
end
