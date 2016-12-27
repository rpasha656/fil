import { Component, Inject } from '@angular/core';
import { Todo } from './todo.model';
import { Title, PubSubServiceContract } from 'microui-contracts';
// import { FileMetadata } from './FileMetadata.model';
import './todolist.html';
@Component({
    moduleId: module.id,
    selector: 'as-todolist',
    template: require('./todolist.html')
})
export class TodolistComponent {
    public todo: Todo;
    public expDate: String;
    public date: Date;
    public list: Todo[];
    public showErrorMsg: boolean;
    public displayName: string;
    public showCompleted: Boolean;
    public date5: Date = new Date();
    /* public fileMetadata: FileMetadata;*/
    constructor(private pubsub: PubSubServiceContract, @Inject(Title) public title: string) {
        this.showCompleted = true;
        this.todo = new Todo('Add me to list!', false);
        this.list = [
            new Todo('Its cool'),
            new Todo('Hello', true)
        ];
    }
    ngOnInit() {
        this.date = new Date();
        this.date.setFullYear(this.date.getFullYear() + 1);
        this.expDate = this.date.toISOString().split('T')[0];
    }
    addTodo() {
        let todo = Todo.clone(this.todo);
        this.list = this.list.concat(todo);
        this.todo.clear();
        this.pubsub.publish('Todo', {
            action: 'added',
            value: todo
        });
    }
    datechanged() {
        console.log(this.expDate);
    }
    checkLength(name: string) {
        if (name && (name.toString().length >= 40)) {
            this.showErrorMsg = true;
            this.displayName = this.displayName.substring(0, 40);
        }
        if (name && (name.toString().length < 40)) {
            this.showErrorMsg = false;
        }
    }
    delTodo(todoIndex: number) {
        this.list = this.list.filter((todo, index) => index !== todoIndex);
        this.pubsub.publish('Todo', {
            action: 'deleted',
            value: todoIndex
        });
    }

    logTodo(todoIndex: number) {
        this.pubsub.publish('Todo', {
            action: 'toggle status',
            value: {
                name: this.list[todoIndex].name,
                previous: this.list[todoIndex].done,
                current: !this.list[todoIndex].done
            }
        });
    }

    /*addFileMetaData() {
        let fileMetadate = FileMetadata.clone(this.fileMetadata);
        this.pubsub.addFileMetaDate(fileMetadate);
    };*/
}
