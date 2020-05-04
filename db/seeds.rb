# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

rails g resource game name:string

rails g resource user name:string points:integer game:references


game_1 = Game.create(name: "Game1")
game_2 = Game.create(name: "Game2")

user_1 = User.create(name: "George", points: 1, game_id: 1)
user_2 = User.create(name: "Ben", points: 5, game_id: 1)
user_3 = User.create(name: "Kev", points: 3, game_id: 1)
user_4 = User.create(name: "Bryan", points: 1, game_id: 2)
user_5 = User.create(name: "Carol", points: 1, game_id: 2)