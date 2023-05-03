# language: fr
Fonctionnalité: todo liste

  Plan du scénario: Création d'une tâche (<path>)
    Etant donné que je suis sur la page "<path>".
    Quand je crée une tâche "item-1" dans la catégorie "category 1".
    Alors je vois "item-1" dans la liste des tâches.
    Et je vois "item-1" dans la liste des tâches avec la catégorie "category 1".

    Exemples:
      | path                 |
      | imperative           |
      | rxjs                 |
      | ngrx                 |
      | ngrx-component-store |
      | state-adapt          |
      | rx-angular           |
      | signal               |

  Plan du scénario: Completion d'une tâche <path>
    Etant donné que je suis sur la page "<path>".
    Quand je crée une tâche "item-1" dans la catégorie "category 1".
    Et que je crée une tâche "item-2" dans la catégorie "category 1".
    Et que je marque la tâche "item-1" comme complétée.
    Alors je ne vois pas "item-1" dans la liste des taches.
    Et je vois "item-1" dans la liste des tâches complétées.
    Et je vois "item-1" comme étant complétée.

    Exemples:
      | path                 |
      | imperative           |
      | rxjs                 |
      | ngrx                 |
      | ngrx-component-store |
      | state-adapt          |
      | rx-angular           |
      | signal               |

  Plan du scénario: Uncompletion d'une tâche <path>
    Etant donné que je suis sur la page "<path>".
    Quand je crée une tâche "item-1" dans la catégorie "category 1".
    Et que je marque la tâche "item-1" comme complétée.
    Et que je marque toutes les tâches comme incomplètes.
    Alors je vois "item-1" dans la liste des tâches.
    Et je ne vois pas "item-1" comme étant complétée.

    Exemples:
      | path                 |
      | imperative           |
      | rxjs                 |
      | ngrx                 |
      | ngrx-component-store |
      | state-adapt          |
      | rx-angular           |
      | signal               |
