class UsersController < ApplicationController

    def index
        users = User.all
        render json: users
      end

    def show 
        user = User.find_by_id(params[:id])  
        render json: user
    end

    def new 
        user = User.new
    end

    def create 
        user = User.create(name: params[:name], points: 0, game_id: params[:game_id])
        render json: user
    end

    def update
        byebug
        user = User.find_by_id(params[:id])
        user.update(name: params[:name], points: [:points], game_id: params[:game_id])
            render json: user

    end

    def destroy
        user = User.find_by_id(params[:id])
        user.destroy
        render json: {}
    end



end
