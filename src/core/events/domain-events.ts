import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'

type DomainEventCallback = (event: unknown) => void

export class DomainEvents {
  // Subscribers (Objeto que contem chave "Nome do evento" e um array de Callbacks "Subscribers" - Funções que são executadas com determinado evento)
  // Exemplo: Vamos criar um subscriber para o evento de registrar uma nova pergunta
  // DomainEvents.register(callback, CrieiNovaPerguntaClasseDeEvento.name)
  private static handlersMap: Record<string, DomainEventCallback[]> = {}

  // Array de Agregados (AggregateRoot) que tem eventos prontos para serem disparados (pendentes)
  private static markedAggregates: AggregateRoot<unknown>[] = []

  public static shouldRun = true

  // Registra um agregado que possuí eventos para serem disparados
  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id)

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate)
    }
  }

  // Chama a função de dispatch para cada DomainEvent[] da classe AggregateRoot
  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    aggregate.domainEvents.forEach((event: DomainEvent) => this.dispatch(event))
  }

  // Remove o agregado do markedAggregates
  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate))

    this.markedAggregates.splice(index, 1)
  }

  // Procura se já existe um agregado com mesmo UniqueEntityId (Classe UUID)
  private static findMarkedAggregateByID(
    id: UniqueEntityId,
  ): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id))
  }

  // Chama a função dispatchAggregateEvents para o agregado (AggregateRoot) e o remove da lista de agregados com eventos disponíveis.
  public static dispatchEventsForAggregate(id: UniqueEntityId) {
    const aggregate = this.findMarkedAggregateByID(id)

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate)
      aggregate.clearEvents()
      this.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  // Cria um handlersMap (Subscriber) para um nome de classe evento
  public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = []
    }

    this.handlersMap[eventClassName].push(callback)
  }

  public static clearHandlers() {
    this.handlersMap = {}
  }

  public static clearMarkedAggregates() {
    this.markedAggregates = []
  }

  // Procura por um subscriber (handlersMap) com chave do nome da classe de evento e chama as funções callback passadas.
  private static dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name

    const isEventRegistered = eventClassName in this.handlersMap

    if (!this.shouldRun) {
      return
    }

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName]

      for (const handler of handlers) {
        handler(event)
      }
    }
  }
}
